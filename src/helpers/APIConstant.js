/**
 * @providersModule API
 */

const API = {
  requestType: {
    get: "GET",
    post: "POST",
    put: "PUT",
    delete: "DELETE",
  },
  url: "https://xengon.tech",
  homeBlog: "/blog/wp-json/wp/v2/posts?per_page=5&sort=date&order=desc",
  verifyCode: (phone) => `/api/verifyCode?phone=${phone}`,
  carBrand: "/api/carBrand",
  carType: "/api/carType",
  carModel: (car_brand_id,car_type_id) => `/api/carModel?car_brand_id=${car_brand_id}&car_type_id=${car_type_id}`,
  register: "/api/register",
  login: (phone) => `/api/login?phone=${phone}`,
  getInfo: (user_id) => `/api/getInfo?user_id=${user_id}`,
  updateProfile: "/api/updateProfile",
  updateToken: "/api/updateToken",
  updateNotification: "/api/updateNoty",
  updateAvatar: "/api/updateAvatar",
  home: "/api/home",
  serviceCategory: "/api/serviceCategory",
  shop:(userId) =>  `/api/shop?user_id=${userId}`,
  productCategory: "/api/productCategory",
  listProduct:(user_id, category_id, index, number_post) => `/api/listProduct?user_id=${user_id}&category_id=${category_id}&index=${index}&number_post=${number_post}`,
  productDetail:(userId,productId) => `/api/productDetail?user_id=${userId}&product_id=${productId}`,
  addProduct: "/api/addProduct",
  cartInfo:(userId) => `/api/cartInfo?user_id=${userId}`,
  deleteProduct: "/api/deleteProduct",
  favouriteProduct: "/api/favouriteProduct",
  unFavourite: "/api/unFavourite",
  ratingProduct: "/api/ratingProduct",
  bookingProduct: "/api/bookingProduct",
  bookingProductDetail: "/api/bookingProductDetail",
  bookingService: "/api/bookingService",
  // eslint-disable-next-line camelcase
  bookingServiceDetail: (booking_id, user_id) => `/api/bookingServiceDetail?booking_id=${booking_id}&user_id=${user_id}`,
  updateStatusBooking: "/api/updateStatusBooking",
  ratingBooking: "/api/ratingBooking",
  searchProduct:(index, numberPost, userId, key) => `/api/searchProduct?index=${index}&number_post=${numberPost}&user_id=${userId}&key=${key}`,
  bookingList: "/api/listBooking",
  notification: (user_id) => `/api/notification?user_id=${user_id}`,
  notificationDetail: (user_id,noty_id) => `/api/notificationDetail?user_id=${user_id}&noty_id=${noty_id}`,
  privacy: "/api/privacy",
  feedback: "/api/feedback",
  feedbackCategory: (user_id) => `/api/feedbackCategory?user_id=${user_id}`,
  searchProductCategory:(index, numberPost, userId, key, category_id) => `/api/searchProduct?index=${index}&number_post=${numberPost}&user_id=${userId}&key=${key}&category_id=${category_id}`,
  checkPromotion: (user_id,promotion_code,service_id) => `/api/checkPromotion?user_id=${user_id}&promotion_code=${promotion_code}&service_id=${service_id}`,
};

export default API;