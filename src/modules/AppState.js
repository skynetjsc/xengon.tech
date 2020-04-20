// @flow
type AppStateType = {
  isFirstOpen: boolean,
  isOpenModal: boolean,
  isLogin: boolean,
  profile: any,
  paramsRegister: any,
  location: any
};

type ActionType = {
  type: string,
  payload?: any,
};

export const initialState: AppStateType = {
  isFirstOpen: true,
  isOpenModal: false,
  isLogin: false,
  profile: null,
  paramsRegister: null,
  formRegisterService: null
};

export const RESET_APP_STATE = 'AppState/RESET_APP_STATE';
export const SET_FIRST_OPEN = 'AppState/SET_FIRST_OPEN';
export const SET_IS_OPEN_MODAL = 'AppState/SET_IS_OPEN_MODAL';
export const SET_IS_LOGIN = 'AppState/SET_IS_LOGIN';
export const SET_PROFILE = 'AppState/SET_PROFILE';
export const SET_PARAMS_REGISTER = 'AppState/SET_PARAMS_REGISTER';
export const SET_FORM_REGISTER_SERVICE = 'AppState/SET_FORM_REGISTER_SERVICE';

export function resetAppState(): ActionType {
  return {
    type: RESET_APP_STATE,
  };
}

export function setAppOpened(): ActionType {
  return {
    type: SET_FIRST_OPEN,
  };
}

export function setModalOpened(status): ActionType {
  return {
    type: SET_IS_OPEN_MODAL,
    status
  };
}

export function setIsLogin():ActionType {
  return {
    type: SET_IS_LOGIN,
  }
}

export function setProfile(profile): ActionType {
  return {
    type: SET_PROFILE,
    profile
  };
}

export function setParamsRegister(params): ActionType {
  return {
    type: SET_PARAMS_REGISTER,
    params
  };
}

export function setFormRegisterService(paramsRegisterService): ActionType {
  return {
    type: SET_FORM_REGISTER_SERVICE,
    paramsRegisterService
  };
}

export default function AppStateReducer(
  state: AppStateType = initialState,
  action: ActionType,
): AppStateType {
  switch (action.type) {
    case RESET_APP_STATE:
      return {
        ...state,
        ...initialState,
        isFirstOpen: false
      };
    case SET_FIRST_OPEN:
      return {
        ...state,
        isFirstOpen: false,
      };
    case SET_IS_OPEN_MODAL:
      return {
        ...state,
        isOpenModal: action.status,
      };
    case SET_IS_LOGIN:
      return {
        ...state,
        isLogin: true,
      };
    case SET_PROFILE:
      return {
        ...state,
        profile: action.profile
      };
    case SET_PARAMS_REGISTER:
      return {
        ...state,
        paramsRegister: action.params
      };
    case SET_FORM_REGISTER_SERVICE:
      return {
        ...state,
        formRegisterService: action.paramsRegisterService
      };
    default:
      return state;
  }
}
