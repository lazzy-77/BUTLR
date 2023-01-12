import { createSlice } from "@reduxjs/toolkit"
import { getAllCartJobs, getTotalCartItemPrice } from "../../utils/helpers"

const initialState = {
  items: [],
}

const authSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    updateBasket: (state, action) => {
      state.items = action.payload
    }
  }
})

export const { updateBasket } = authSlice.actions

export const selectCartItems = state => state.basket.items
export const selectTotalPrice = state => getTotalCartItemPrice(state.basket.items)
export const selectTotalItems = state => getAllCartJobs(state.basket.items);


export default authSlice.reducer