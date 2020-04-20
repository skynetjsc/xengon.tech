import APIManager from '../helpers/APIManager';

/**
 * Created by Hoang Nguyen Ba on 19/03/2020.
 *
 * @format
 */

const types = {
  GET_PRODUCT_DETAIL_START: "GET_PRODUCT_DETAIL_START",
  GET_PRODUCT_DETAIL_SUCCESS: "GET_PRODUCT_DETAIL_SUCCESS",
  GET_PRODUCT_DETAIL_FAIL: "GET_PRODUCT_DETAIL_FAIL",
  FAVOURITE_PRODUCT: "FAVOURITE_PRODUCT",
  UNFAVOURITE_PRODUCT: "UNFAVOURITE_PRODUCT",
};

export const actions = {
  getProductDetail: (dispatch, userId, productId) => {
    dispatch({type: types.GET_PRODUCT_DETAIL_START, userId, productId});
    APIManager.getInstance().getProductDetail(userId, productId)
      .then(res => {
        //console.log("data: ", res);
        const {data} = res.data;
        actions.getProductDetailSuccess(dispatch, data);
      })
      .catch(error => {
        //console.log(error);
        actions.getProductDetailFail(dispatch, error)
      })
  },
  getProductDetailSuccess: (dispatch,data) => {
    dispatch({
      type: types.GET_PRODUCT_DETAIL_SUCCESS,
      data
    })
  },

  getProductDetailFail: (dispatch,error) => {
    dispatch({
      type: types.GET_PRODUCT_DETAIL_FAIL,
      error
    })
  },

  handleFavourite: (dispatch) => {
    dispatch({type: types.FAVOURITE_PRODUCT})
  },

  handleUnfavourite: (dispatch) => {
    dispatch({type: types.UNFAVOURITE_PRODUCT})
  }
};

const initialState = {
  isFetching: false,
  error: null,
  data: null,
  is_favourite: null
};

export const ProductDetailReducer = (state = initialState, action) => {
  const {data, error, type} = action;

  switch (type) {
    case types.GET_PRODUCT_DETAIL_START: {
      return{
        ...state,
        isFetching: true
      }
    }

    case types.GET_PRODUCT_DETAIL_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        data,
        is_favourite: data.is_favourite
      }
    }

    case types.GET_PRODUCT_DETAIL_FAIL: {
      return {
        ...state,
        isFetching: false,
        error
      }
    }

    case types.FAVOURITE_PRODUCT: {
      return {
        ...state,
        isFetching: false,
        is_favourite: "1",
      }
    }

    case types.UNFAVOURITE_PRODUCT: {
      return {
        ...state,
        isFetching: false,
        is_favourite: "0",
      }
    }

    default: return state
  }
};
