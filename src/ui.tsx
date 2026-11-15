import React, { PropsWithChildren, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextStyle,
  ViewStyle,
  StyleProp,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import Svg, { Rect, Path, Circle, Ellipse, G } from "react-native-svg";
import { FoodKind } from "./model";

export const colors = {
  ink: "#171717",
  secondary: "#666666",
  line: "#E3E3E3",
  soft: "#F3F3F3",
  white: "#FFFFFF",
};
export function Label({
  children,
  size = 14,
  bold = false,
  muted = false,
  serif = false,
  style,
}: PropsWithChildren<{
  size?: number;
  bold?: boolean;
  muted?: boolean;
  serif?: boolean;
  style?: StyleProp<TextStyle>;
}>) {
  return (
    <Text
      style={[
        {
          fontFamily: serif ? "Lora" : bold ? "DMBold" : "DM",
          fontSize: size,
          lineHeight: size * 1.4,
          color: muted ? colors.secondary : colors.ink,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
export function Icon({
  name,
  size = 20,
  color = colors.ink,
}: {
  name: React.ComponentProps<typeof Feather>["name"];
  size?: number;
  color?: string;
}) {
  return (
    <Feather
      name={name}
      size={size}
      color={color}
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}
export function IconButton({
  name,
  label,
  onPress,
}: {
  name: React.ComponentProps<typeof Feather>["name"];
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        { opacity: pressed ? 0.55 : 1 },
      ]}
    >
      <Icon name={name} />
    </Pressable>
  );
}
export function Button({
  children,
  onPress,
  secondary = false,
  disabled = false,
  style,
}: PropsWithChildren<{
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}>) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondaryButton,
        disabled && { backgroundColor: "#E7E7E7", borderColor: "#E7E7E7" },
        pressed && { opacity: 0.7 },
        style,
      ]}
    >
      <Label
        bold
        size={14}
        style={{
          color: disabled ? "#888" : secondary ? colors.ink : "#FFF",
          textAlign: "center",
        }}
      >
        {children}
      </Label>
    </Pressable>
  );
}
export function Card({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}
export function Heading({
  children,
  subtitle,
}: PropsWithChildren<{ subtitle?: string }>) {
  return (
    <View style={{ gap: 6 }}>
      <Label size={27} bold>
        {children}
      </Label>
      {subtitle && <Label muted>{subtitle}</Label>}
    </View>
  );
}
export function Badge({
  children,
  dark = false,
}: PropsWithChildren<{ dark?: boolean }>) {
  return (
    <View style={[styles.badge, dark && { backgroundColor: colors.ink }]}>
      <Label size={11} bold style={dark ? { color: "#FFF" } : undefined}>
        {children}
      </Label>
    </View>
  );
}
export function Row({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.row, style]}>{children}</View>;
}
export function Pair({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <Row style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
      <Label bold={bold} style={{ flex: 1 }}>
        {label}
      </Label>
      <Label bold style={{ maxWidth: "55%", textAlign: "right" }}>
        {value}
      </Label>
    </Row>
  );
}
export function Divider() {
  return <View style={{ height: 1, backgroundColor: colors.line }} />;
}
export function Choices<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <Row style={{ gap: 8 }}>
      {options.map((option) => (
        <Pressable
          key={option}
          accessibilityRole="button"
          accessibilityState={{ selected: option === value }}
          onPress={() => onChange(option)}
          style={[
            styles.choice,
            value === option && { backgroundColor: colors.ink },
          ]}
        >
          <Label
            size={12}
            bold
            style={{
              textAlign: "center",
              color: value === option ? "#FFF" : colors.ink,
            }}
          >
            {option}
          </Label>
        </Pressable>
      ))}
    </Row>
  );
}
export function Field({
  label,
  value,
  onChange,
  placeholder,
  secure = false,
  keyboardType,
  multiline = false,
  editable = true,
  error,
}: {
  label: string;
  value: string;
  onChange?: (s: string) => void;
  placeholder?: string;
  secure?: boolean;
  keyboardType?: "email-address" | "phone-pad" | "default";
  multiline?: boolean;
  editable?: boolean;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <View style={{ gap: 6 }}>
      <Label size={12} bold>
        {label}
      </Label>
      <View
        style={[
          styles.inputRow,
          error ? { borderColor: "#777" } : null,
          !editable && { backgroundColor: colors.soft },
        ]}
      >
        <TextInput
          accessibilityLabel={label}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#8B8B8B"
          editable={editable}
          secureTextEntry={secure && !show}
          keyboardType={keyboardType}
          autoCapitalize={
            keyboardType === "email-address" || secure ? "none" : "sentences"
          }
          autoCorrect={!secure && keyboardType !== "email-address"}
          multiline={multiline}
          style={[
            styles.input,
            multiline && { minHeight: 80, textAlignVertical: "top" },
          ]}
        />
        {secure && (
          <IconButton
            name={show ? "eye-off" : "eye"}
            label={show ? "Hide password" : "Show password"}
            onPress={() => setShow(!show)}
          />
        )}
      </View>
      {error && <Label size={12}>{error}</Label>}
    </View>
  );
}
export function Search({
  value,
  onChange,
  placeholder = "Search food or restaurants",
}: {
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={styles.search}>
      <Icon name="search" size={18} />
      <TextInput
        accessibilityLabel={placeholder}
        placeholder={placeholder}
        placeholderTextColor="#777"
        value={value}
        onChangeText={onChange}
        style={[styles.input, { paddingVertical: 12 }]}
        autoCapitalize="none"
      />
      {!!value && (
        <IconButton
          name="x"
          label="Clear search"
          onPress={() => onChange("")}
        />
      )}
    </View>
  );
}
export function Notice({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <Card style={{ backgroundColor: "#F6F6F6" }}>
      <Label bold>{title}</Label>
      {typeof children === "string" ? (
        <Label size={13} muted>
          {children}
        </Label>
      ) : (
        children
      )}
    </Card>
  );
}
export function Empty({
  icon = "shopping-bag",
  title,
  message,
  action,
  onPress,
}: {
  icon?: React.ComponentProps<typeof Feather>["name"];
  title: string;
  message: string;
  action: string;
  onPress: () => void;
}) {
  return (
    <View style={{ gap: 18, paddingTop: 60 }}>
      <View style={styles.emptyIcon}>
        <Icon name={icon} size={28} />
      </View>
      <Heading subtitle={message}>{title}</Heading>
      <Button onPress={onPress}>{action}</Button>
    </View>
  );
}
export function Counter({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <Row style={{ gap: 4 }}>
      <IconButton
        name="minus"
        label="Decrease quantity"
        onPress={() => onChange(value - 1)}
      />
      <Label bold style={{ minWidth: 22, textAlign: "center" }}>
        {value}
      </Label>
      <IconButton
        name="plus"
        label="Increase quantity"
        onPress={() => onChange(value + 1)}
      />
    </Row>
  );
}
export function Screen({
  title,
  children,
  onBack,
  footer,
  tabs,
  brand = false,
  onProfile,
}: PropsWithChildren<{
  title: string;
  onBack?: () => void;
  footer?: React.ReactNode;
  tabs?: React.ReactNode;
  brand?: boolean;
  onProfile?: () => void;
}>) {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          {onBack && (
            <IconButton name="chevron-left" label="Go back" onPress={onBack} />
          )}
          <Label
            serif={brand}
            size={brand ? 27 : 17}
            bold={!brand}
            style={{ flex: 1 }}
          >
            {title}
          </Label>
          {onProfile && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open account"
              onPress={onProfile}
              style={styles.avatar}
            >
              <Label size={12} bold>
                AS
              </Label>
            </Pressable>
          )}
        </View>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
        {footer && <View style={styles.footer}>{footer}</View>}
        {tabs}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
export function Food({
  kind,
  width = "100%",
  height = 150,
}: {
  kind: FoodKind;
  width?: number | `${number}%`;
  height?: number;
}) {
  return (
    <View
      accessibilityLabel={`${kind} illustration`}
      accessible
      style={{
        width,
        height,
        backgroundColor: colors.soft,
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <Svg width="100%" height="100%" viewBox="0 0 200 180">
        <Rect width="200" height="180" fill="#F3F3F3" />
        {kind === "burger" && (
          <>
            <Path d="M39 82C42 25 158 25 161 82Z" fill="#D4D4D4" />
            <Path
              d="M44 70L156 70M61 55L67 53M93 49L98 47M128 55L135 57"
              stroke="#FFF"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <Rect x="34" y="88" width="132" height="15" rx="7" fill="#303030" />
            <Path
              d="M37 107L64 115L87 108L113 117L139 108L163 113"
              fill="none"
              stroke="#929292"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <Path d="M39 123H161L153 143H48Z" fill="#C9C9C9" />
          </>
        )}
        {kind === "pizza" && (
          <>
            <Circle cx="100" cy="98" r="62" fill="#C8C8C8" />
            <Circle cx="100" cy="98" r="51" fill="#EFEFEF" />
            <Path
              d="M100 47V149M49 98H150M63 61L137 135M63 135L137 61"
              stroke="#B5B5B5"
              strokeWidth="2"
            />
            <G fill="#555">
              {[
                [81, 72],
                [126, 87],
                [87, 121],
                [121, 120],
                [65, 100],
              ].map(([cx, cy]) => (
                <Circle key={`${cx}`} cx={cx} cy={cy} r="9" />
              ))}
            </G>
          </>
        )}
        {kind === "bowl" && (
          <>
            <Path d="M39 90H161C154 145 46 145 39 90Z" fill="#424242" />
            <Ellipse cx="100" cy="89" rx="61" ry="25" fill="#D9D9D9" />
            <G fill="#858585">
              <Ellipse cx="75" cy="78" rx="20" ry="12" />
              <Ellipse cx="114" cy="89" rx="24" ry="14" />
              <Ellipse cx="89" cy="99" rx="18" ry="10" />
            </G>
            <Path
              d="M64 58L80 48M109 58L126 44M134 66L144 55"
              stroke="#494949"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </>
        )}
        {kind === "fries" && (
          <>
            <Path
              d="M65 50V118M85 40V121M105 48V125M125 38V120M145 55V120"
              stroke="#777"
              strokeWidth="11"
            />
            <Path d="M48 90L59 154H150L160 90Z" fill="#C0C0C0" />
            <Path
              d="M68 104Q104 127 140 104"
              fill="none"
              stroke="#EFEFEF"
              strokeWidth="5"
            />
          </>
        )}
        {kind === "brownie" && (
          <>
            <Path d="M45 68L131 39L164 112L80 148Z" fill="#555" />
            <Path d="M45 68L80 148L80 116L45 42Z" fill="#323232" />
            <Path d="M45 42L129 18L164 86L80 116Z" fill="#9A9A9A" />
            <G fill="#333">
              <Circle cx="82" cy="51" r="5" />
              <Circle cx="119" cy="54" r="5" />
              <Circle cx="108" cy="83" r="5" />
            </G>
          </>
        )}
      </Svg>
    </View>
  );
}
export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFF" },
  header: {
    paddingHorizontal: 20,
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  content: { padding: 24, paddingTop: 8, paddingBottom: 30, gap: 18 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  card: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 16,
    gap: 10,
    backgroundColor: "#FFF",
  },
  button: {
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: colors.ink,
    borderWidth: 1,
    borderColor: colors.ink,
    justifyContent: "center",
    padding: 12,
  },
  secondaryButton: { borderColor: colors.line, backgroundColor: "#FFF" },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  choice: {
    flex: 1,
    backgroundColor: colors.soft,
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: "center",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#EFEFEF",
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 6,
  },
  inputRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 9,
    alignItems: "center",
  },
  input: {
    fontFamily: "DM",
    fontSize: 14,
    color: colors.ink,
    flex: 1,
    minWidth: 0,
    padding: 14,
    minHeight: 50,
    outlineWidth: 0,
  },
  search: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: "#EEE",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 10,
    gap: 10,
    backgroundColor: "#FFF",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.soft,
  },
  emptyIcon: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: colors.soft,
    alignItems: "center",
    justifyContent: "center",
  },
});
