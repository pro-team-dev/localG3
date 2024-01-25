import { View, Text } from "react-native";
import React from "react";
import Star from "./Star";

type ReviewStarType = {
  rating: number;
  width?: number;
  height?: number;
};

const ReviewStar = (props: ReviewStarType) => {
  const { rating, width, height } = props;
  let intRating = Math.floor(rating);
  let remainingOneDecimalPoint = Math.round((rating - intRating) * 10);
  let extraDullStar = 5 - Math.ceil(rating);
  return (
    <View className="flex-row">
      {[...Array(intRating)].map((_, i) => (
        <Star
          key={i}
          percentage={100}
          width={width ? width : 30}
          height={height ? height : 30}
        />
      ))}
      {remainingOneDecimalPoint > 0 && (
        <Star
          percentage={remainingOneDecimalPoint * 10}
          width={width ? width : 30}
          height={height ? height : 30}
        />
      )}
      {[...Array(extraDullStar)].map((_, i) => (
        <Star
          key={i}
          percentage={0}
          width={width ? width : 30}
          height={height ? height : 30}
        />
      ))}
    </View>
  );
};

export default ReviewStar;
