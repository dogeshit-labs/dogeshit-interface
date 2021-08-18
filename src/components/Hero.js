import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

import { imageSizes } from "../imageSizes.js";
import { breakpoints } from "../breakpoints.js";

const getUseStyles = (imgName) =>
  makeStyles((theme) => ({
    heroImg: {
      flexShrink: 0,
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",

      width: "100%",
      height: "0",
      [theme.breakpoints.down("sm")]: {
        backgroundImage: "url(./images/sm/" + imgName + ".png)",
        paddingTop:
          String(
            (
              (imageSizes.sm[imgName].height / imageSizes.sm[imgName].width) *
              100
            ).toFixed(3)
          ) + "%",
      },
      [theme.breakpoints.between(
        theme.breakpoints.width("sm") + 1,
        theme.breakpoints.width("md") + 1
      )]: {
        backgroundImage: "url(./images/md/" + imgName + ".png)",
        paddingTop:
          String(
            (
              (imageSizes.md[imgName].height / imageSizes.md[imgName].width) *
              100
            ).toFixed(3)
          ) + "%",
      },
      [theme.breakpoints.between(
        theme.breakpoints.width("md") + 1,
        theme.breakpoints.width("lg") + 1
      )]: {
        backgroundImage: "url(./images/lg/" + imgName + ".png)",
        paddingTop:
          String(
            (
              (imageSizes.lg[imgName].height / imageSizes.lg[imgName].width) *
              100
            ).toFixed(3)
          ) + "%",
      },
      [theme.breakpoints.between(
        theme.breakpoints.width("lg") + 1,
        theme.breakpoints.width("xl") + 1
      )]: {
        backgroundImage: "url(./images/xl/" + imgName + ".png)",
        paddingTop:
          String(
            (
              (imageSizes.xl[imgName].height / imageSizes.xl[imgName].width) *
              100
            ).toFixed(3)
          ) + "%",
      },
      [theme.breakpoints.between(
        theme.breakpoints.width("xl") + 1,
        breakpoints.xxl + 1
      )]: {
        backgroundImage: "url(./images/xxl/" + imgName + ".png)",
        paddingTop:
          String(
            (
              (imageSizes.xxl[imgName].height / imageSizes.xxl[imgName].width) *
              100
            ).toFixed(3)
          ) + "%",
      },
      [theme.breakpoints.between(breakpoints.xxl + 1, breakpoints.xxxl + 1)]: {
        backgroundImage: "url(./images/xxxl/" + imgName + ".png)",
        paddingTop:
          String(
            (
              (imageSizes.xxxl[imgName].height /
                imageSizes.xxxl[imgName].width) *
              100
            ).toFixed(3)
          ) + "%",
      },
      [theme.breakpoints.up(breakpoints.xxxl + 1)]: {
        backgroundImage: "url(./images/xxxxl/" + imgName + ".png)",
        paddingTop:
          String(
            (
              (imageSizes.xxxxl[imgName].height /
                imageSizes.xxxxl[imgName].width) *
              100
            ).toFixed(3)
          ) + "%",
      },
    },
    hero: {
      [theme.breakpoints.down("sm")]: {
        marginTop:
          "-" +
          String(
            (
              (imageSizes.sm[imgName].height / imageSizes.sm[imgName].width) *
              100
            ).toFixed(3)
          ) +
          "%",
      },
      [theme.breakpoints.between(
        theme.breakpoints.width("sm") + 1,
        theme.breakpoints.width("md") + 1
      )]: {
        marginTop:
          "-" +
          String(
            (
              (imageSizes.md[imgName].height / imageSizes.md[imgName].width) *
              100
            ).toFixed(3)
          ) +
          "%",
      },
      [theme.breakpoints.between(
        theme.breakpoints.width("md") + 1,
        theme.breakpoints.width("lg") + 1
      )]: {
        marginTop:
          "-" +
          String(
            (
              (imageSizes.lg[imgName].height / imageSizes.lg[imgName].width) *
              100
            ).toFixed(3)
          ) +
          "%",
      },
      [theme.breakpoints.between(
        theme.breakpoints.width("lg") + 1,
        theme.breakpoints.width("xl") + 1
      )]: {
        marginTop:
          "-" +
          String(
            (
              (imageSizes.xl[imgName].height / imageSizes.xl[imgName].width) *
              100
            ).toFixed(3)
          ) +
          "%",
      },
      [theme.breakpoints.between(
        theme.breakpoints.width("xl") + 1,
        breakpoints.xxl + 1
      )]: {
        marginTop:
          "-" +
          String(
            (
              (imageSizes.xxl[imgName].height / imageSizes.xxl[imgName].width) *
              100
            ).toFixed(3)
          ) +
          "%",
      },
      [theme.breakpoints.between(breakpoints.xxl + 1, breakpoints.xxxl + 1)]: {
        marginTop:
          "-" +
          String(
            (
              (imageSizes.xxxl[imgName].height /
                imageSizes.xxxl[imgName].width) *
              100
            ).toFixed(3)
          ) +
          "%",
      },
      [theme.breakpoints.up(breakpoints.xxxl + 1)]: {
        marginTop:
          "-" +
          String(
            (
              (imageSizes.xxxxl[imgName].height /
                imageSizes.xxxxl[imgName].width) *
              100
            ).toFixed(3)
          ) +
          "%",
      },
    },
    heroContent: {
      display: "flex",
      //flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-end",
      marginTop: "64px",
      marginLeft: 211,
    },
  }));

const styleGenerators = {
  "": () => ({ heroImg: {}, hero: {}, heroContent: {} }),
  dogeshit: getUseStyles("dogeshit"),
};
/**
 * A hero component. This will display the Hero image at the top of the page.
 *
 * The heroContent will be rendered overtop of the Hero image.
 * The children will be rendered directly beneath the Hero image.
 * @component
 */
function Hero(props) {
  const img = props.imgName;

  const classes = styleGenerators[img]();

  if (typeof img === "undefined" || img === "") {
    return <div>{props.children}</div>;
  }

  return (
    <div className={classes.heroImg}>
      <div className={classes.hero}>
        <div className={classes.heroContent}>{props.heroContent}</div>
      </div>
    </div>
  );
}

Hero.propTypes = {
  /**
   * The name of the image to use as the Hero, should be accessible under /public/images/{sm,md,lg,xl,xxl,xxxl,xxxxl}
   */
  imgName: PropTypes.string,
  /**
   * The elements to display on top of the hero.
   */
  heroContent: PropTypes.element,
  /**
   * The content to display below the hero.
   */
  children: PropTypes.element.isRequired,
};

Hero.defaultProps = {
  imgName: "",
};

export default Hero;
