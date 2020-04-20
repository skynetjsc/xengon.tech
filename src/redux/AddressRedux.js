/**
 * Created by Hoang Nguyen Ba on 06/03/2020.
 *
 * @format
 */

const types = {
  ADD_ADDRESS: "ADD_ADDRESS",
  SELECT_ADDRESS: "SELECT_ADDRESS",
  DELETE_ADDRESS: "DELETE_ADDRESS",
};

export const actions = {
  addAddress: (dispatch, address) => {
    dispatch({
      type: types.ADD_ADDRESS,
      address
    })
  },

  selectAddress: (dispatch, address) => {
    dispatch({
      type: types.SELECT_ADDRESS,
      address
    })
  },

  deleteAddress: (dispatch, address) => {
    dispatch({
      type: types.DELETE_ADDRESS,
      address
    })
  }
};

const initialState = {
  list_address: [],
  address: ""
};

export const AddressReducer = (state = initialState, action) => {
  const {type, address} = action;
  switch (type) {
    case types.ADD_ADDRESS: {
      if(address !== "") {
       return {
         ...state,
         list_address:[...state.list_address, address]
       };
      }
      return {
        ...state,
      }
    }

    case types.SELECT_ADDRESS: {
      return {
        ...state,
        address
      }
    }

    case types.DELETE_ADDRESS: {
      const {list_address} = state;
      const index = list_address.indexOf(address);
      list_address.splice(index, 1);
      return {
        ...state,
        list_address
      }
    }

    default: {
      return state;
    }
  }
};
