import React from "react";
import { View } from "react-native";
import ProfileInput from "./ProfileInput";
import { SOCIAL_MEDIA_FIELDS } from "../../../constants/organizer";
import { SocialMediaLinks } from "../../../types/organizer";

interface SocialMediaInputsProps {
  values: SocialMediaLinks;
  onChange: (key: keyof SocialMediaLinks, value: string) => void;
}

export default function SocialMediaInputs({
  values,
  onChange,
}: SocialMediaInputsProps) {
  return (
    <View>
      {SOCIAL_MEDIA_FIELDS.map((field) => (
        <ProfileInput
          key={field.key}
          label={field.label}
          value={values[field.key]}
          onChangeText={(text) => onChange(field.key, text)}
          placeholder={field.placeholder}
          autoCapitalize="none"
          keyboardType="url"
        />
      ))}
    </View>
  );
}
