import APIManager from '../helpers/APIManager';

/**
 * Created by Lan Tran Duc on 17/03/2020.
 *
 * @format
 */



const types = {
  GET_ACTIVITIES_API_START:"GET_ACTIVITIES_API_START",
  GET_ACTIVITIES_API_SUCCESS:"GET_ACTIVITIES_API_SUCCESS",
  GET_ACTIVITIES_API_FAIL:"GET_ACTIVITIES_API_FAIL",
  // GET_CONTENT_CATEGORY: "GET_CONTENT_CATEGORY"
};

export const actions = {
  getApiActivities:(dispatch, userId) => {
    dispatch({ type: types.GET_ACTIVITIES_API_START });
   APIManager.getInstance().getActivitiesAPI(userId)
     .then(res =>
     {
       const {data} = res.data;
       dispatch(actions.getApiActivitiesSuccess(data));
     })
     .catch(err => dispatch(actions.getApiActivitiesFailure(err)));
  },
  getApiActivitiesSuccess: (data) => ({
    type: types.GET_ACTIVITIES_API_SUCCESS,
    data
  }),
  getApiActivitiesFailure: (error) => ({
    type: types.GET_ACTIVITIES_API_FAIL,
    error,
  }),
  // getContentCategory: (dispatch, categoryId) => {
  //   dispatch({
  //     type: types.GET_CONTENT_CATEGORY,
  //     categoryId
  //   });
  //   // return category;
  // }
};

const initialState = {
  isFetching: true,
  error: null,
  data: null,
  category: null,
};

export const ActivitiesReducer = (state = initialState, action) => {
  const { data, type, error} = action;
  switch (type) {

    case types.GET_ACTIVITIES_API_START: {
      return {
        ...state,
        isFetching: true,
        error: null,
        message: "",
      };
    }

    case types.GET_ACTIVITIES_API_FAIL: {
      return {
        ...state,
        isFetching: false,
        error,
      };
    }

    case types.GET_ACTIVITIES_API_SUCCESS: {
      return {
        ...state,
        isFetching:false,
        data,
      };
    }
    // case types.GET_CONTENT_CATEGORY: {
    //   const category = state.data.category.filter((item) => item.id === categoryId);
    //   return {
    //     ...state,
    //     category
    //   }
    // }

    default: {
      return state;
    }
  }
};
