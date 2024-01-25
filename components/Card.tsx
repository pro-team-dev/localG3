import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import ReviewStar from "./reviewStar";

interface UserReviewCardProps {
  username: string;
  avatar: string;
  rating: number;
  reviewText: string;
}

const UserReviewCard: React.FC<UserReviewCardProps> = ({
  username,
  avatar,
  rating,
  reviewText,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.userContainer}>
        <Image style={styles.avatar} source={{ uri: avatar }} />
        <View>
          <Text style={styles.username}>{username}</Text>
          {/* <Text style={styles.subtitle}>Verified User</Text> */}
          <View style={styles.ratingContainer}>
            <ReviewStar rating={rating} width={14} height={14} />
          </View>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.reviewText}>{reviewText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    color: "gray",
  },
  content: {
    marginTop: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 5,
  },
  reviewText: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 22,
  },
});

export default UserReviewCard;
