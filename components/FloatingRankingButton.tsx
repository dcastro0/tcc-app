import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Pressable } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import tw from "twrnc";

export const FloatingRankingButton = () => {
    const width = useSharedValue(60);
    const opacity = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: width.value,
        };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    useEffect(() => {
        const expandAndCollapse = () => {
            width.value = withSequence(
                withDelay(2000, withTiming(150, { duration: 400 })),
                withDelay(2000, withTiming(60, { duration: 400 }))
            );
            opacity.value = withSequence(
                withDelay(2200, withTiming(1, { duration: 200 })),
                withDelay(1600, withTiming(0, { duration: 200 }))
            );
        };

        const intervalId = setInterval(expandAndCollapse, 6000);

        return () => clearInterval(intervalId);
    }, [width, opacity]);

    return (
        <Pressable
            onPress={() => router.push("/ranking")}
            style={tw`absolute bottom-8 right-6`}
        >
            <Animated.View
                style={[
                    tw`bg-amber-500 h-[60px] rounded-full flex-row items-center justify-center shadow-lg`,
                    animatedStyle,
                ]}
            >
                <Feather name="bar-chart-2" size={24} color="white" style={tw`absolute left-[18px]`} />
                <Animated.Text
                    style={[
                        tw`text-white font-bold text-base ml-8`,
                        animatedTextStyle,
                    ]}
                >
                    #5
                </Animated.Text>
            </Animated.View>
        </Pressable>
    );
};