const axios = require('axios');

class SkillAcademyAPI {
  constructor() {
    this.baseURL = process.env.SKILL_ACADEMY_BASE_URL;
    this.clientID = process.env.SKILL_ACADEMY_CLIENT_ID;
    this.clientSecret = process.env.SKILL_ACADEMY_CLIENT_SECRET;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry > Date.now()) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(`${this.baseURL}/skillacademy/public/access-token`, {
        clientID: this.clientID,
        clientSecret: this.clientSecret
      });

      this.accessToken = response.data.data.accessToken;
      this.tokenExpiry = Date.now() + (response.data.data.expiresIn * 1000);
      
      return this.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw new Error('Failed to get access token');
    }
  }

  async getCourses(page = 1, pageSize = 10) {
    const token = await this.getAccessToken();
    try {
      const response = await axios.get(`${this.baseURL}/skillacademy/public/courses`, {
        headers: { Authorization: token },
        params: { page, pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw new Error('Failed to fetch courses');
    }
  }

  async getCourseDetails(courseSerial) {
    const token = await this.getAccessToken();
    try {
      const response = await axios.get(`${this.baseURL}/skillacademy/public/course`, {
        headers: { Authorization: token },
        params: { courseSerial }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching course details:', error);
      throw new Error('Failed to fetch course details');
    }
  }

  async createOrder(email, packageSerial) {
    const token = await this.getAccessToken();
    try {
      const response = await axios.post(`${this.baseURL}/skillacademy/public/order`, {
        email,
        packageSerial
      }, {
        headers: { Authorization: token }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  async getSignInToken(email) {
    const token = await this.getAccessToken();
    try {
      const response = await axios.post(`${this.baseURL}/skillacademy/public/sign-in`, {
        email
      }, {
        headers: { Authorization: token }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting sign in token:', error);
      throw new Error('Failed to get sign in token');
    }
  }
}

module.exports = new SkillAcademyAPI();