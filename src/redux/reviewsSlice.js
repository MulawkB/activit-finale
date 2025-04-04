import { createSlice } from "@reduxjs/toolkit";

const initialState = []
const reviewsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        addReviews: (state, action) => {
            return [
                ...state,
                {id: Date.now(), text: action.payload.text , note: action.payload.note},
            ];
        }
    }
})
export const { addReviews } = reviewsSlice.actions;
export default reviewsSlice.reducer