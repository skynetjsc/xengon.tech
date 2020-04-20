import APIManager from '../helpers/APIManager';

/**
 * Created by Hoang Nguyen Ba on 06/03/2020.
 *
 * @format
 */



const types = {
  GET_ORDER_DETAIL_API_START:"GET_ORDER_DETAIL_API_START",
  GET_ORDER_DETAIL_API_SUCCESS:"GET_ORDER_DETAIL_API_SUCCESS",
  GET_ORDER_DETAIL_API_FAIL:"GET_ORDER_DETAIL_API_FAIL",
};

export const actions = {
  getApiOrderDetail: (dispatch, orderId, userId) => {
    dispatch({ type: types.GET_ORDER_DETAIL_API_START });
    APIManager.getInstance().getOrderDetail(orderId, userId)
      .then(res =>
      {
        const {data} = res.data;
        dispatch(actions.getApiOrderDetailSuccess(data));
      })
      .catch(err => dispatch(actions.getApiOrderDetailFailure(err)));

  },
  getApiOrderDetailSuccess: (data) => ({
    type: types.GET_ORDER_DETAIL_API_SUCCESS,
    data
  }),
  getApiOrderDetailFailure: (error) => ({
    type: types.GET_ORDER_DETAIL_API_FAIL,
    error,
  }),
};

const initialState = {
  isFetching: false,
  error: null,
  data: null,
};

export const OrderDetailReducer = (state = initialState, action) => {
  const { data, type, error} = action;
  switch (type) {

    case types.GET_ORDER_DETAIL_API_START: {
      return {
        ...state,
        isFetching: true,
        error: null,
        message: "",
      };
    }

    case types.GET_ORDER_DETAIL_API_FAIL: {
      return {
        ...state,
        isFetching: false,
        data: null,
        error,
      };
    }

    case types.GET_ORDER_DETAIL_API_SUCCESS: {
      return {
        ...state,
        isFetching:false,
        data,
        error:null,
      };
    }

    default: {
      return state;
    }
  }
};
