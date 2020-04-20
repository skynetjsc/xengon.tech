import APIManager from '../helpers/APIManager';

/**
 * Created by Hoang Nguyen Ba on 06/03/2020.
 *
 * @format
 */



const types = {
  GET_SERVICE_DETAIL_API_START:"GET_SERVICE_DETAIL_API_START",
  GET_SERVICE_DETAIL_API_SUCCESS:"GET_SERVICE_DETAIL_API_SUCCESS",
  GET_SERVICE_DETAIL_API_FAIL:"GET_SERVICE_DETAIL_API_FAIL",
};

export const actions = {
  getApiCategoryDetail: (dispatch, categoryId, carTypeId) => {
    dispatch({ type: types.GET_SERVICE_DETAIL_API_START });
    let json = APIManager.getInstance().getServiceDetail(categoryId, carTypeId)
      .then(res =>
      {
        const {data} = res.data;
        dispatch(actions.getApiCategoryDetailSuccess(data));
      })
      .catch(err => dispatch(actions.getApiCategoryDetailFailure(err)));

  },
  getApiCategoryDetailSuccess: (data) => ({
    type: types.GET_SERVICE_DETAIL_API_SUCCESS,
    data
  }),
  getApiCategoryDetailFailure: (error) => ({
    type: types.GET_SERVICE_DETAIL_API_FAIL,
    error,
  }),
};

const initialState = {
  isFetching: false,
  error: null,
  data: null,
};

export const ServiceDetailReducer = (state = initialState, action) => {
  const { data, type, error} = action;
  switch (type) {

    case types.GET_SERVICE_DETAIL_API_START: {
      return {
        ...state,
        isFetching: true,
        error: null,
        message: "",
      };
    }

    case types.GET_SERVICE_DETAIL_API_FAIL: {
      return {
        ...state,
        isFetching: false,
        error,
      };
    }

    case types.GET_SERVICE_DETAIL_API_SUCCESS: {
      return {
        ...state,
        isFetching:false,
        data,
      };
    }

    default: {
      return state;
    }
  }
};
