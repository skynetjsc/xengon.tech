import APIManager from '../helpers/APIManager';

/**
 * Created by Hoang Nguyen Ba on 06/03/2020.
 *
 * @format
 */

const types = {
  GET_CART_API_START: "GET_CART_API_START",
  GET_CART_API_SUCCESS: "GET_CART_API_SUCCESS",
  GET_CART_API_FAIL: "GET_CART_API_FAIL"
};

export const actions = {
  getCartApi: (dispatch, userId) => {
    dispatch({
      type: types.GET_CART_API_START,
      userId,
    });
    APIManager.getInstance().getInfoCart(userId)
      .then(res => {
        const {data} = res.data;
        //console.log("cart info: ", data);
        actions.getCartApiSuccess(dispatch, data)
      })
      .catch(error => {
        actions.getCartApiFail(dispatch, error);
      })
  },

  getCartApiSuccess: (dispatch, data) => {
    dispatch({
      type: types.GET_CART_API_SUCCESS,
      data,
    })
  },

  getCartApiFail: (dispatch, error) => {
    dispatch({
      type: types.GET_CART_API_FAIL,
      error,
    })
  }
};

const initialState = {
  isFetching: false,
  data: null,
  error: null
};

export const CartReducer = (state = initialState, action) => {
  const {type, data, error} = action;
  switch (type) {
    case types.GET_CART_API_START: {
      return {
        ...state,
        isFetching: true
      };
    }

    case types.GET_CART_API_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        data
      };
    }

    case types.GET_CART_API_FAIL: {
      return {
        ...state,
        isFetching: false,
        error
      };
    }

    default: {
      return state;
    }
  }
};
