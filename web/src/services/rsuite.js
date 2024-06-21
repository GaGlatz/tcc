import { Notification } from "rsuite";
import "rsuite/dist/styles/rsuite-default.css";

const supportedTypes = ["success", "warning", "info", "error"];

export const notification = (type, params) => {
  if (!supportedTypes.includes(type)) {
    throw new Error(
      `Unsupported notification type: ${type}. Supported types are ${supportedTypes.join(
        ", "
      )}`
    );
  }

  Notification[type](params);
};
