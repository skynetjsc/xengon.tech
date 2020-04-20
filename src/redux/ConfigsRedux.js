import APIManager from '../helpers/APIManager';

/**
 * Created by Hoang Nguyen Ba on 06/03/2020.
 *
 * @format
 */

const types = {
  GET_CONFIG_START: "GET_CONFIG_START",
  GET_CONFIG_SUCCESS: "GET_CONFIG_SUCCESS",
  GET_CONFIG_FAIL: "GET_CONFIG_FAIL"
};

export const actions = {
  getConfigApi: (dispatch) => {
    dispatch({
      type: types.GET_CONFIG_START,
    });
    APIManager.getInstance().getConfigs()
      .then(res => {
        const {data} = res.data;
        console.log("config: ", data);
        actions.getConfigSuccess(dispatch, data)
      })
      .catch(error => {
        actions.getConfigFail(dispatch, error);
      })
  },

  getConfigSuccess: (dispatch, data) => {
    dispatch({
      type: types.GET_CONFIG_SUCCESS,
      data,
    })
  },

  getConfigFail: (dispatch, error) => {
    dispatch({
      type: types.GET_CONFIG_FAIL,
      error,
    })
  }
};

const initialState = {
  isFetching: false,
  data: null,
  error: null
};

export const ConfigReducer = (state = initialState, action) => {
  const {type, data, error} = action;
  switch (type) {
    case types.GET_CONFIG_START: {
      return {
        ...state,
        isFetching: true
      };
    }

    case types.GET_CONFIG_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        data
      };
    }

    case types.GET_CONFIG_FAIL: {
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
