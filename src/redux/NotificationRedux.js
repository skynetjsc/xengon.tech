import APIManager from '../helpers/APIManager';

const types = {
  GET_NOTIFICATION_API_START: "GET_NOTIFICATION_API_START",
  GET_NOTIFICATION_API_SUCCESS: "GET_NOTIFICATION_API_SUCCESS",
  GET_NOTIFICATION_API_FAIL: "GET_NOTIFICATION_API_FAIL",
};

export const actions = {
  getApiNotification: (dispatch, userId) => {
    dispatch({type: types.GET_NOTIFICATION_API_START});
    APIManager.getInstance().notification(userId)
      .then(res => {
        // console.log("data: ", res);
        const {data} = res.data;
        actions.getNotificationSuccess(dispatch, data);
      })
      .catch(error => {
        //console.log(error);
        actions.getNotificationFail(dispatch, error)
      })
  },
  getNotificationSuccess: (dispatch,data) => {
    dispatch({type: types.GET_NOTIFICATION_API_SUCCESS, data})
  },
  getNotificationFail: (dispatch,error) => {
    dispatch({type: types.GET_NOTIFICATION_API_FAIL, error})
  }
};

const initialState = {
  isFetching: true,
  error: null,
  data: null,
};

export const NotificationReducer = (state = initialState, action) => {
  const {data, error, type} = action;
  switch (type) {
    case types.GET_SHOP_API_START: {
      return {
        ...state,
        isFetching: true,
      }
    }

    case types.GET_NOTIFICATION_API_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        data
      }
    }

    case types.GET_NOTIFICATION_API_FAIL: {
      return {
        ...state,
        isFetching: false,
        error
      }
    }

    default: return state;
  }
};

