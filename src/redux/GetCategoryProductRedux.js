import APIManager from '../helpers/APIManager';

/**
 * Created by Hoang Nguyen Ba on 06/03/2020.
 *
 * @format
 */

const types = {
  GET_CATEGORY_PRODUCT: "GET_CATEGORY_PRODUCT",
  GET_CATEGORY_PRODUCT_SUCCESS: "GET_CATEGORY_PRODUCT_SUCCESS",
  GET_CATEGORY_PRODUCT_FAIL: "GET_CATEGORY_PRODUCT_FAIL",
}

export const actions = {
  getCategoryProduct: (dispatch) => {
    dispatch({type: types.GET_CATEGORY_PRODUCT})
    APIManager.getInstance().getCategory()
      .then(res => {
        const {data} = res.data;
        actions.getSuccess(dispatch, data)
      })
      .catch(err => {
        actions.getFail(dispatch, err)
      });
  },
  getSuccess: (dispatch, data) => {
    dispatch({type: types.GET_CATEGORY_PRODUCT_SUCCESS, data})
  },
  getFail: (dispatch, error) => {
    dispatch({type: types.GET_CATEGORY_PRODUCT_FAIL, error})
  }
};

const initialState = {
  isFetching: false,
  data: null,
  error: null
}

export const CategoryProductReducer = (state = initialState, action) => {
  const {type, data, error} = action;
  switch (type) {
    case types.GET_CATEGORY_PRODUCT: {
      return {
        ...state,
        isFetching: true
      };
    }

    case types.GET_CATEGORY_PRODUCT_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        data
      };
    }

    case types.GET_CATEGORY_PRODUCT_FAIL: {
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
