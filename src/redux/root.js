import { combineReducers } from "redux";
import user from "./user/user";
import incidents from "./incidents/incident";
import communautes from "./communautes/participate";

const rootReducer = combineReducers({
  user,
  incidents,
  communautes,
}); export default rootReducer;
