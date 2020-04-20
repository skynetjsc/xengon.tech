import APIManager from '../helpers/APIManager';

/**
 * Created by Hoang Nguyen Ba on 06/03/2020.
 *
 * @format
 */



const types = {
  GET_HOME_BLOG_API_START:"GET_HOME_BLOG_API_START",
  GET_HOME_BLOG_API_SUCCESS:"GET_HOME_BLOG_API_SUCCESS",
  GET_HOME_BLOG_API_FAIL:"GET_HOME_BLOG_API_FAIL",
};

export const actionBlogs = {
  getApiHomeBlog:(dispatch) => {
    dispatch({ type: types.GET_HOME_BLOG_API_START });
    APIManager.getInstance().getHomeBlog()
      .then(res =>
      {
        // console.log("blogs", res);
        const {data} = res;
        const blogImages = [];
        if (data.length > 0) {
          dispatch(actionBlogs.getApiHomeBlogSuccess(data));
          data.map((item, index) => {
            if (item.hasOwnProperty("_links") && item._links) {
              const links = item._links;
              if (links.hasOwnProperty("wp:featuredmedia") && links["wp:featuredmedia"]
                && links["wp:featuredmedia"].length > 0 && links["wp:featuredmedia"][0].hasOwnProperty("href") && links["wp:featuredmedia"][0].href) {
                const {href} = links["wp:featuredmedia"][0];
                APIManager.getInstance().getBlogImageDetail(href)
                  .then(media => {
                    const detail = media.data;
                    if (detail.hasOwnProperty("guid") && detail.guid && detail.guid.hasOwnProperty("rendered") && detail.guid.rendered) {
                      item.image_blog = detail.guid.rendered;
                      if (index === data.length - 1) {
                        dispatch(actionBlogs.getApiHomeBlogSuccess(data));
                      }
                    }
                  })
                  .catch(error => {/* console.log(error) */});
              }
            }
          });
          // console.log(blogImages);
        }

      })
      .catch(err => dispatch(actionBlogs.getApiHomeBlogFailure(err)));
  },
  getApiHomeBlogSuccess: (data) => ({
    type: types.GET_HOME_BLOG_API_SUCCESS,
    blogs: data
  }),
  getApiHomeBlogFailure: (error) => ({
    type: types.GET_HOME_BLOG_API_FAIL,
    error,
  }),
};

const initialState = {
  isFetching: true,
  error: null,
  blogs: null,
};

export const HomeBlogReducer = (state = initialState, action) => {
  const { blogs, type, error, blogImages} = action;
  switch (type) {
    case types.GET_HOME_BLOG_API_START: {
      return {
        ...state,
        isFetching: true,
        error: null,
        message: "",
      };
    }

    case types.GET_HOME_BLOG_API_FAIL: {
      return {
        ...state,
        isFetching: false,
        error,
      };
    }

    case types.GET_HOME_BLOG_API_SUCCESS: {
      return {
        ...state,
        isFetching:false,
        blogs,
      };
    }

    default: {
      return state;
    }
  }
};
