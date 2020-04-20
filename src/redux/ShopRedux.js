import APIManager from '../helpers/APIManager';

/**
 * Created by Hoang Nguyen Ba on 06/03/2020.
 *
 * @format
 */

const types = {
  GET_SHOP_API_START: "GET_SHOP_API_START",
  GET_SHOP_API_SUCCESS: "GET_SHOP_API_SUCCESS",
  GET_SHOP_API_FAIL: "GET_SHOP_API_FAIL",
};

export const actions = {
  getApiShop: (dispatch, userId) => {
    dispatch({type: types.GET_SHOP_API_START, userId});
    let json = APIManager.getInstance().shop(userId)
      .then(res => {
        //console.log("data: ", res);
        const {data} = res.data;
        actions.getShopApiSuccess(dispatch, data);
      })
      .catch(error => {
        //console.log(error);
        actions.getShopApiFail(dispatch, error)
      })
  },
  getShopApiSuccess: (dispatch,data) => {
    dispatch({type: types.GET_SHOP_API_SUCCESS, data})
  },
  getShopApiFail: (dispatch,error) => {
    dispatch({type: types.GET_SHOP_API_FAIL, error})
  }
};

const initialState = {
  isFetching: true,
  error: null,
  data: null,
}

export const ShopReducer = (state = initialState, action) => {
  const {data, error, type} = action;
  switch (type) {
    case types.GET_SHOP_API_START: {
      return {
        ...state,
        isFetching: true,
      }
    }

    case types.GET_SHOP_API_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        data
      }
    }

    case types.GET_SHOP_API_FAIL: {
      return {
        ...state,
        isFetching: false,
        error
      }
    }

    default: return state;
  }
};

