import APIManager from '../helpers/APIManager';

const types = {
  GET_ADDRESS: "GET_ADDRESS",
  GET_ADDRESS_SUCCESS: "GET_ADDRESS_SUCCESS",
  GET_ADDRESS_FAIL: "GET_ADDRESS_FAIL",
  SELECT_ADDRESS: "SELECT_ADDRESS",
  CHANGE_STATUS: "CHANGE_STATUS"
};

export const actions = {
  getAddress: (dispatch) => {
    dispatch({
      type: types.GET_ADDRESS,
    });
      APIManager.getInstance().getWorkShopAddress()
        .then(res => {
          const {data} = res.data;
          actions.getAddressSuccess(dispatch, data)
        })
        .catch(err => {
          actions.getAddressFail(dispatch, err)
        })
  },

  getAddressSuccess: (dispatch, data) => {
    dispatch({type: types.GET_ADDRESS_SUCCESS, data})
  },

  getAddressFail: (dispatch, error) => {
    dispatch({type: types.GET_ADDRESS_SUCCESS, error})
  },

  selectAddress: (dispatch, address) => {
    dispatch({
      type: types.SELECT_ADDRESS,
      address
    })
  },

  changeStatus: (dispatch) => {
    dispatch({type: types.CHANGE_STATUS})
  }
};

const initialState = {
  isFetch: false,
  data: null,
  error: null,
  address: "",
  status: 2
};

export const WorkShopReducer = (state = initialState, action) => {
  const {type, address, data, error} = action;
  switch (type) {
    case types.GET_ADDRESS: {
      return {
        ...state,
        isFetch: true
      }
    }

    case types.GET_ADDRESS_SUCCESS: {
      return {
        ...state,
        isFetch: false,
        data
      }
    }

    case types.GET_ADDRESS_FAIL: {
      return {
        ...state,
        isFetch: false,
        error
      }
    }

    case types.SELECT_ADDRESS: {
      return {
        ...state,
        address,
        status: 1
      }
    }

    case types.CHANGE_STATUS: {
      return {
        ...state,
        status: 2
      }
    }

    default: {
      return state;
    }
  }
};
