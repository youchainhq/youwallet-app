/**
 * Created by greason on 2019/4/12.
 */

import EStyleSheet from "react-native-extended-stylesheet";
import theme from "../common/theme";
import { screen } from "../common/utils";

const colors = theme.colors.front;
const contentWidth = theme.frontContentWidth;

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    position: "relative"
  },
  backgroundImage: {
    position: "absolute",
    left: 0,
    top: 0,
    width: screen.width,
    height: "100%",
    resizeMode: "stretch"
  },

  button: {
    backgroundColor: colors.buttonBg,
    width: contentWidth,
    height: 50,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 25
  }
});

export default styles;
