/**
 * Created by greason on 2019/4/12.
 */

import { Platform } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

import theme from "../common/theme";
import { device, screen } from "../common/utils";

const colors = theme.colors.back;
const distances = theme.distances.back;

const baseStyles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  nav: {
    backgroundColor: "#9206F1",
    position: "absolute",
    width: screen.width,
    left: 0,
    top: 0,
    height: device.android ? 44 : device.ifiPhoneX(88, 64)
  },
  title: {
    color: colors.title,
    marginTop: 11,
    marginBottom: 11,
    marginLeft: 14,
    fontSize: 14
  },

  pageSpace: {
    marginTop: 13
  },

  listContainer: {
    backgroundColor: "#fff",
    marginTop: 0,

    borderTopWidth: 0,
    borderBottomWidth: 0
  },

  listItemTitle: {
    fontWeight: "bold",
    color: colors.listTitle,
    fontSize: 16
  },

  listItemWrapper: {
    ...Platform.select({
      ios: {
        borderBottomWidth: 0.5
      },
      android: {
        borderBottomWidth: 1.0
      }
    }),
    borderBottomColor: colors.listItemBorder,
    marginLeft: 15,
    paddingRight: 15,
    paddingTop: 20,
    paddingBottom: 20
  },
  listItemHeight: {
    height: 60
  },
  listItemTitleNormal: {
    fontWeight: "normal",
    color: colors.listTitle,
    fontSize: 16
  },

  listItemText: {
    color: colors.listText,
    fontSize: 14,
    marginTop: 10
  },

  lastItemStyle: {
    borderBottomWidth: 0,
    borderBottomColor: "transparent"
  },

  inputContainer: {
    flex: 1,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    ...Platform.select({
      ios: {
        borderBottomColor: "transparent",
        borderBottomWidth: 0
      }
    })
  },

  inputStyle: {
    ...Platform.select({
      android: {
        minHeight: 50,
        width: "100%"
      },
      ios: {
        minHeight: 40,
        width: "100%"
      }
    }),
    color: colors.inputText,
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: 16
  },

  button: {
    backgroundColor: colors.buttonBg,
    width: screen.width - 28,
    height: 50,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 25
  },

  modalLayout: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end"
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: colors.listBorder,
    ...Platform.select({
      ios: {
        borderBottomWidth: 0.5
      },
      android: {
        borderBottomWidth: 1.0
      }
    }),
    height: 52
  },
  modalFooter: {
    borderColor: colors.listBorder,
    ...Platform.select({
      ios: {
        borderTopWidth: 0.5
      },
      android: {
        borderTopWidth: 1.0
      }
    }),
    height: 26,
    width: screen.width,
    backgroundColor: colors.background
  },
  modalTitle: {
    fontSize: 18,
    color: colors.modalText,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    paddingLeft: 40
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: "flex-start"
  },

  navLeft: {
    paddingLeft: 14,
    width: distances.navLeft,
    alignItems: "flex-start"
  },
  navRight: {
    paddingRight: 14,
    width: distances.navRight,
    alignItems: "flex-end"
  },
  navRightTextContainer: {
    marginBottom: 2
  },
  navRightText: {
    color: "white"
  }
});

export default baseStyles;
