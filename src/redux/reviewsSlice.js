import { createSlice } from "@reduxjs/toolkit";

const initialState = []

const reviewsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        addReviews: (state, action) => {
            state.push({
                id: Date.now(), text: action.payload.text, note: action.payload.note,
            });
        },
        deleteReview: (state, action) => {
            return state.filter((review) => review.id !== action.payload);
        },
    }
})
export const { addReviews, deleteReview } = reviewsSlice.actions;
export default reviewsSlice.reducer