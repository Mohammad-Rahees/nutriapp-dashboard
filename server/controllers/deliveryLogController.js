const mongoose = require("mongoose");
const Order = require("../models/Order");
const DeliveryLog = require("../models/DeliveryLog");
const User = require("../models/User");

// Helper function to build date filter
const getDateFilter = (dateRange, startDate, endDate) => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (dateRange === "today") {
    return { $gte: startOfToday };
  } else if (dateRange === "last7") {
    const d = new Date(startOfToday);
    d.setDate(d.getDate() - 7);
    return { $gte: d };
  } else if (dateRange === "last30") {
    const d = new Date(startOfToday);
    d.setDate(d.getDate() - 30);
    return { $gte: d };
  } else if (dateRange === "custom" && (startDate || endDate)) {
    const range = {};
    if (startDate) range.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      range.$lte = end;
    }
    return range;
  }
  return null;
};

// @desc    Get delivery dashboard dynamic statistics from MongoDB
// @route   GET /api/delivery-logs/stats
// @access  Delivery/Admin/Private
const getDeliveryStats = async (req, res, next) => {
  try {
    const deliveryPersonId = req.user._id;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Today's Orders: assigned today or created today for this delivery person
    const todayOrders = await Order.countDocuments({
      deliveryPerson: deliveryPersonId,
      $or: [
        { assignedAt: { $gte: startOfToday } },
        { createdAt: { $gte: startOfToday } },
      ],
    });

    // Delivered Today: delivered today by this delivery person
    const deliveredToday = await Order.countDocuments({
      deliveryPerson: deliveryPersonId,
      deliveryStatus: "Delivered",
      deliveredAt: { $gte: startOfToday },
    });

    // Failed Deliveries Today: failed today by this delivery person
    const failedToday = await Order.countDocuments({
      deliveryPerson: deliveryPersonId,
      deliveryStatus: "Failed Delivery",
      $or: [
        { failedAt: { $gte: startOfToday } },
        { updatedAt: { $gte: startOfToday } },
      ],
    });

    // Active Deliveries: currently in Assigned, Picked Up, Out for Delivery
    const activeDeliveries = await Order.countDocuments({
      deliveryPerson: deliveryPersonId,
      deliveryStatus: { $in: ["Assigned", "Picked Up", "Out for Delivery"] },
    });

    res.json({
      todayOrders,
      deliveredToday,
      failedToday,
      activeDeliveries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get delivery history (completed deliveries for delivery person) with search, filter, pagination
// @route   GET /api/delivery-logs/history
// @access  Delivery/Admin/Private
const getDeliveryHistory = async (req, res, next) => {
  try {
    const deliveryPersonId = req.user._id;
    const { search, status, paymentStatus, dateRange, page = 1, limit = 10 } = req.query;

    let query = {
      deliveryPerson: deliveryPersonId,
    };

    // Filter by delivery status
    if (status && status !== "ALL") {
      query.deliveryStatus = status;
    } else {
      // History defaults to completed or all assigned depending on request
      query.deliveryStatus = { $in: ["Delivered", "Failed Delivery"] };
    }

    // Filter by payment status
    if (paymentStatus && paymentStatus !== "ALL") {
      if (paymentStatus === "Paid Online") {
        query.paymentStatus = "Paid";
        query.paymentCollected = { $ne: true };
      } else if (paymentStatus === "Cash On Delivery") {
        query.paymentStatus = { $ne: "Paid" };
        query.paymentCollected = { $ne: true };
      } else if (paymentStatus === "Payment Collected") {
        query.paymentCollected = true;
      }
    }

    // Filter by date range
    const dateFilter = getDateFilter(dateRange);
    if (dateFilter) {
      query.createdAt = dateFilter;
    }

    // Filter by search query (Order ID, Customer Name, Phone)
    if (search && search.trim() !== "") {
      const q = search.trim();
      const isObjectId = mongoose.Types.ObjectId.isValid(q);

      if (isObjectId) {
        query._id = q;
      } else {
        // Search customer details in user population or text fields
        const matchingUsers = await User.find({
          $or: [
            { name: { $regex: q, $options: "i" } },
            { phone: { $regex: q, $options: "i" } },
            { username: { $regex: q, $options: "i" } },
          ],
        }).select("_id");

        const userIds = matchingUsers.map((u) => u._id);

        query.$or = [
          { user: { $in: userIds } },
          { deliveryPhone: { $regex: q, $options: "i" } },
          { deliveryAddress: { $regex: q, $options: "i" } },
        ];
      }
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate("user", "name username email phone address city state postalCode role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      orders,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get delivery person's own daily activity logs (chronological order)
// @route   GET /api/delivery-logs/my-logs
// @access  Delivery/Private
const getMyLogs = async (req, res, next) => {
  try {
    const deliveryPersonId = req.user._id;
    const { search, status, dateRange, page = 1, limit = 10 } = req.query;

    let query = {
      deliveryPerson: deliveryPersonId,
    };

    if (status && status !== "ALL") {
      query.status = status;
    }

    const dateFilter = getDateFilter(dateRange);
    if (dateFilter) {
      query.timestamp = dateFilter;
    }

    if (search && search.trim() !== "") {
      const q = search.trim();
      const isObjectId = mongoose.Types.ObjectId.isValid(q);

      if (isObjectId) {
        query.order = q;
      } else {
        query.$or = [
          { customerName: { $regex: q, $options: "i" } },
          { customerPhone: { $regex: q, $options: "i" } },
          { action: { $regex: q, $options: "i" } },
        ];
      }
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await DeliveryLog.countDocuments(query);
    const logs = await DeliveryLog.find(query)
      .populate({
        path: "order",
        populate: { path: "user", select: "name username email phone address" },
      })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      logs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all delivery activity logs for Admin Monitoring
// @route   GET /api/delivery-logs/admin
// @access  Admin/Private
const getAdminLogs = async (req, res, next) => {
  try {
    const { deliveryPerson, search, status, dateRange, startDate, endDate, page = 1, limit = 10 } = req.query;

    let query = {};

    if (deliveryPerson && mongoose.Types.ObjectId.isValid(deliveryPerson)) {
      query.deliveryPerson = deliveryPerson;
    }

    if (status && status !== "ALL") {
      query.status = status;
    }

    const dateFilter = getDateFilter(dateRange, startDate, endDate);
    if (dateFilter) {
      query.timestamp = dateFilter;
    }

    if (search && search.trim() !== "") {
      const q = search.trim();
      const isObjectId = mongoose.Types.ObjectId.isValid(q);

      if (isObjectId) {
        query.order = q;
      } else {
        // Search by delivery person name or customer name/phone/action
        const matchingDelivery = await User.find({
          role: "Delivery",
          $or: [
            { name: { $regex: q, $options: "i" } },
            { username: { $regex: q, $options: "i" } },
          ],
        }).select("_id");

        const delIds = matchingDelivery.map((d) => d._id);

        query.$or = [
          { deliveryPerson: { $in: delIds } },
          { customerName: { $regex: q, $options: "i" } },
          { customerPhone: { $regex: q, $options: "i" } },
          { action: { $regex: q, $options: "i" } },
        ];
      }
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await DeliveryLog.countDocuments(query);
    const logs = await DeliveryLog.find(query)
      .populate("deliveryPerson", "name username email phone vehicleType vehicleNumber")
      .populate("customer", "name username email phone address")
      .populate({
        path: "order",
        populate: { path: "user", select: "name username email phone address" },
      })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      logs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single log details with order activity history & timeline
// @route   GET /api/delivery-logs/:id
// @access  Delivery/Admin/Private
const getLogDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const log = await DeliveryLog.findById(id)
      .populate("deliveryPerson", "name username email phone vehicleType vehicleNumber emergencyContact")
      .populate("customer", "name username email phone address city state postalCode")
      .populate({
        path: "order",
        populate: { path: "user", select: "name username email phone address" },
      });

    if (!log) {
      res.status(404);
      throw new Error("Delivery log entry not found");
    }

    // Security check: Delivery person can only view their own log
    if (req.user && req.user.role && req.user.role.toLowerCase() === "delivery") {
      if (log.deliveryPerson._id.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Access denied: You can only view your own delivery logs.");
      }
    }

    // Fetch all logs associated with this order for complete activity history
    const orderLogs = await DeliveryLog.find({ order: log.order._id })
      .populate("deliveryPerson", "name username")
      .sort({ timestamp: 1 });

    res.json({
      log,
      activityHistory: orderLogs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDeliveryStats,
  getDeliveryHistory,
  getMyLogs,
  getAdminLogs,
  getLogDetails,
};
