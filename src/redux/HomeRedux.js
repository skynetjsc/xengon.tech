import APIManager from '../helpers/APIManager';

/**
 * Created by Hoang Nguyen Ba on 06/03/2020.
 *
 * @format
 */



const types = {
  GET_HOME_API_START:"GET_HOME_API_START",
  GET_HOME_API_SUCCESS:"GET_HOME_API_SUCCESS",
  GET_HOME_API_FAIL:"GET_HOME_API_FAIL",
  GET_CONTENT_CATEGORY: "GET_CONTENT_CATEGORY"
};

export const actions = {
  getApiHome:(dispatch, userId) => {
    dispatch({ type: types.GET_HOME_API_START });
   APIManager.getInstance().getHomeAPI(userId)
     .then(res =>{
       const {data} = res.data;
       dispatch(actions.getApiHomeSuccess(data));
     })
     .catch(err => dispatch(actions.getApiHomeFailure(err)));

  },
  getApiHomeSuccess: (data) => ({
    type: types.GET_HOME_API_SUCCESS,
    data
  }),
  getApiHomeFailure: (error) => ({
    type: types.GET_HOME_API_FAIL,
    error,
  }),
  getContentCategory: (dispatch, categoryId) => {
    dispatch({
      type: types.GET_CONTENT_CATEGORY,
      categoryId
    });
    // return category;
  }
};

const initialState = {
  isFetching: true,
  error: null,
  data: null,
  category: null,
};

export const HomeReducer = (state = initialState, action) => {
  const { data, type, error, categoryId} = action;
  switch (type) {

    case types.GET_HOME_API_START: {
      return {
        ...state,
        isFetching: true,
        error: null,
        message: "",
      };
    }

    case types.GET_HOME_API_FAIL: {
      return {
        ...state,
        isFetching: false,
        error,
      };
    }

    case types.GET_HOME_API_SUCCESS: {
      return {
        ...state,
        isFetching:false,
        data,
      };
    }
    case types.GET_CONTENT_CATEGORY: {
      const category = state.data.category.filter((item) => item.id === categoryId);
      return {
        ...state,
        category
      }
    }

    default: {
      return state;
    }
  }
};
