import * as React from "react";
import ButtonUnstyled, {
  ButtonUnstyledProps,
  buttonUnstyledClasses,
} from "@mui/base/ButtonUnstyled";
import { styled } from "@mui/material/styles";
import {
  FaDiscord,
  FaTwitter,
  FaTelegram,
  FaYoutube,
  FaMedium,
  FaVideo,
  FaVideoSlash,
  FaWallet,
  FaHandshakeSlash,
} from "react-icons/fa";
import { AppSelector } from "../../store";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { useDispatch } from "react-redux";

const ButtonRoot = React.forwardRef(function ButtonRoot(
  props: React.PropsWithChildren<{}>,
  ref: React.ForwardedRef<any>
) {
  const { children, ...other } = props;

  return (
    <svg width="150" height="100" {...other} ref={ref}>
      <polygon points="0,100 0,0 150,0 150,100" className="bg" />
      <polygon points="0,100 0,0 150,0 150,100" className="borderEffect" />
      <foreignObject x="0" y="0" width="150" height="100">
        <div className="content">{children}</div>
      </foreignObject>
    </svg>
  );
});

const blue = {
  50: "#F0F7FF",
  100: "#C2E0FF",
  200: "#99CCF3",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  800: "#004C99",
  900: "#623313",
};

const CustomButtonRoot = styled(ButtonRoot)(
  ({ theme }: { theme: any }) => `
  overflow: visible;
  cursor: pointer;
  --main-color: ${theme.palette.mode === "light" ? blue[600] : blue[100]};
  --hover-color: ${theme.palette.mode === "light" ? blue[50] : blue[900]};
  --active-color: ${theme.palette.mode === "light" ? blue[100] : blue[800]};

  & polygon {
    fill: transparent;
    transition: all 800ms ease;
    pointer-events: none;
  }
  
  & .bg {
    stroke: var(--main-color);
    stroke-width: 1;
    filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.1));
    fill: transparent;
  }

  & .borderEffect {
    stroke: var(--main-color);
    stroke-width: 2;
    stroke-dasharray: 150 600;
    stroke-dashoffset: 150;
    fill: transparent;
  }

  &:hover,
  &.${buttonUnstyledClasses.focusVisible} {
    .borderEffect {
      stroke-dashoffset: -600;
    }

    .bg {
      fill: var(--hover-color);
    }
  }

  &:focus,
  &.${buttonUnstyledClasses.focusVisible} {
    outline: 2px solid ${theme.palette.mode === "dark" ? blue[900] : blue[200]};
    outline-offset: 2px;
  }

  &.${buttonUnstyledClasses.active} { 
    & .bg {
      fill: var(--active-color);
      transition: fill 300ms ease-out;
    }
  }

  & foreignObject {
    pointer-events: none;

    & .content {
      font-size: 0.875rem;
      font-family: IBM Plex Sans, sans-serif;
      font-weight: 500;
      line-height: 1.5;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--main-color);
      text-transform: uppercase;
    }

    & svg {
      margin: 0 5px;
    }
  }`
);

const SvgButton = React.forwardRef(function SvgButton(
  props: ButtonUnstyledProps,
  ref: React.ForwardedRef<any>
) {
  return <ButtonUnstyled {...props} component={CustomButtonRoot} ref={ref} />;
});

const Type = (type: any) => {
  switch (type) {
    case "Discord":
      return <FaDiscord />;
    case "Twitter":
      return <FaTwitter />;
    case "Telegram":
      return <FaTelegram />;
    case "Youtube":
      return <FaYoutube />;
    case "Medium":
      return <FaMedium />;
    default:
      break;
  }
};

type Props = {
  type: string;
  link: string;
};

const RectBtn: React.FC<Props> = ({ type, link }) => {
  // Hook
  const dispatch = useDispatch();
  const { showAnimation, showVoucherWalletBtn } = AppSelector(gameState);

  // Function
  const setShowAnimation = () => {
    if (showAnimation) {
      dispatch(
        updateState({
          showAnimation: false,
        })
      );
      localStorage.setItem("showAnimation", "0");
    } else {
      dispatch(
        updateState({
          showAnimation: true,
        })
      );
      localStorage.setItem("showAnimation", "1");
    }
  };

  const setShowVoucherWalletBtn = () => {
    if (showVoucherWalletBtn) {
      dispatch(
        updateState({
          showVoucherWalletBtn: false,
        })
      );
      localStorage.setItem("showVoucherWalletBtn", "0");
    } else {
      dispatch(
        updateState({
          showVoucherWalletBtn: true,
        })
      );
      localStorage.setItem("showVoucherWalletBtn", "1");
    }
  };

  if (type === "ShowAnimation") {
    return (
      <a>
        <SvgButton style={{ margin: 10 }} onClick={() => setShowAnimation()}>
          {showAnimation ? (
            <div className="fc1">
              <div style={{ textAlign: "center", fontSize: 32 }}>
                <FaVideo />
              </div>
              <div style={{ textAlign: "center" }}>NFT Videos</div>
            </div>
          ) : (
            <div className="fc1">
              <div style={{ textAlign: "center", fontSize: 32 }}>
                <FaVideoSlash />
              </div>
              <div style={{ textAlign: "center" }}>NFT Images</div>
            </div>
          )}
        </SvgButton>
      </a>
    );
  } else if (type === "ShowVoucherWalletBtn") {
    return (
      <a>
        <SvgButton
          style={{ margin: 10 }}
          onClick={() => setShowVoucherWalletBtn()}
        >
          {showVoucherWalletBtn ? (
            <div className="fc1">
              <div style={{ textAlign: "center", fontSize: 32 }}>
                <FaWallet />
              </div>
              <div style={{ textAlign: "center" }}>Showing Voucher</div>
            </div>
          ) : (
            <div className="fc1">
              <div style={{ textAlign: "center", fontSize: 32 }}>
                <FaHandshakeSlash />
              </div>
              <div style={{ textAlign: "center" }}>Voucher Hidden</div>
            </div>
          )}
        </SvgButton>
      </a>
    );
  } else {
    return (
      <a href={link} target="_blank" className="td-none">
        <SvgButton style={{ margin: 10 }}>
          <div className="fc1">
            <div style={{ textAlign: "center", fontSize: 32 }}>
              {Type(type)}
            </div>
            <div style={{ textAlign: "center" }}>{type}</div>
          </div>
        </SvgButton>
      </a>
    );
  }
};
export default RectBtn;
