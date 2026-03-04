import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import { SkeletonProps } from "@/types";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const Skeleton = ({
  width,
  height,
  borderRadius = 8,
  className,
}: SkeletonProps) => {
  return (
    <View className={className}>
      <ShimmerPlaceholder
        width={typeof width === "string" ? undefined : width}
        height={typeof height === "string" ? undefined : height}
        shimmerStyle={{
          borderRadius,
          width: width as any,
          height: height as any,
        }}
        shimmerColors={["#262626", "#333333", "#262626"]}
      />
    </View>
  );
};

export default Skeleton;
