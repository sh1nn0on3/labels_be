class ResponseHelper {
  // Success responses
  static success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static created(res, data = null, message = 'Created successfully') {
    return this.success(res, data, message, 200);
  }

  // Error responses
  static error(res, message = 'Something went wrong', statusCode = 200) {
    return res.status(statusCode).json({
      success: false,
      message
    });
  }

  static badRequest(res, message = 'Bad request') {
    return this.error(res, message, 200);
  }

  static unauthorized(res, message = 'Unauthorized') {
    return this.error(res, message, 200);
  }

  static forbidden(res, message = 'Forbidden') {
    return this.error(res, message, 200);
  }

  static notFound(res, message = 'Not found') {
    return this.error(res, message, 200);
  }

  // Validation error response
  static validationError(res, errors) {
    return res.status(200).json({
      success: false,
      message: 'Validation error',
      errors
    });
  }

  // Pagination response
  static paginate(res, data, page, limit, total) {
    return this.success(res, {
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  }
}

module.exports = ResponseHelper; 