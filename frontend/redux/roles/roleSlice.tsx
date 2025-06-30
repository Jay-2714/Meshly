"use client"
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum Role {
  admin= "admin",
  user= "user",
  creator= "creator"  
}
interface RoleState {
    values: Role;
}
const initialState: RoleState = {
    values: Role.user,  
  };

export const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRole:(state,actions: PayloadAction<Role>) =>{
        state.values = actions.payload;
    }, 
    admin: state => {
        state.values = Role.admin;
    },
    user: state => {
        state.values = Role.user;
    },
    creator: state => {
      state.values = Role.creator;
    }

  },
});
export const {admin , user , setRole} = roleSlice.actions;
export default roleSlice.reducer;