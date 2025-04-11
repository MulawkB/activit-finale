
export const selectReviews = (state) => state.reviews;

export const selectCompletedReviews = (state) =>
    state.reviews.filter((review) => review.completed);