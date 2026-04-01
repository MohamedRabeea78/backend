class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.success = statusCode < 400;
    this.message = message;
    if (data !== null) this.data = data;
  }

  /**
   * Send a generic success response
   * @param {import('express').Response} res
   * @param {string} message
   * @param {any} data
   * @param {number} statusCode
   */
  static success(res, message, data = null, statusCode = 200) {
    return res.status(statusCode).json(new ApiResponse(statusCode, message, data));
  }

  /**
   * Send a 201 Created response
   * @param {import('express').Response} res
   * @param {string} message
   * @param {any} data
   */
  static created(res, message, data = null) {
    return res.status(201).json(new ApiResponse(201, message, data));
  }

  /**
   * Send a paginated list response
   * @param {import('express').Response} res
   * @param {string} message
   * @param {any[]} data
   * @param {{ page: number, limit: number, total: number, totalPages: number }} pagination
   */
  static paginated(res, message, data, pagination) {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination,
    });
  }

  /**
   * Send a 204 No Content response
   * @param {import('express').Response} res
   */
  static noContent(res) {
    return res.status(204).send();
  }
}

module.exports = ApiResponse;
