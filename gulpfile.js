import gulp from 'gulp';
import {
  deleteAsync
} from 'del';
import minHTML from 'gulp-htmlmin';
import minCSS from 'gulp-clean-css';
import minJS from 'gulp-terser';
import minImage from 'gulp-libsquoosh';
import minSVG from 'gulp-svgmin';

const {
  src,
  dest,
  series
} = gulp;
const Path = {
  Src: './src/',
  Build: './build/',
};

const cleanSourceFolder = () => deleteAsync( [ `${Path.Src}*` ] );

const cleanBuildFolder = () => deleteAsync( [ `${Path.Build}*` ] );

const clearAll = series( cleanSourceFolder, cleanBuildFolder );

const minifyHTML = () => {
  return src( `${Path.Src}**/*.html` )
    .pipe( minHTML( {
      collapseWhitespace: true
    } ) )
    .pipe( dest( Path.Build ) );
};

const minifyCSS = () => {
  return src( `${Path.Src}**/*.css` )
    .pipe( minCSS( {
      level: 2
    } ) )
    .pipe( dest( Path.Build ) );
};

const minifyJS = () => {
  return src( `${Path.Src}**/*.js` )
    .pipe( minJS() )
    .pipe( dest( Path.Build ) );
};

const minifyRaster = () => {
  return src( [
      `${Path.Src}**/*.jpg`,
      `${Path.Src}**/*.jpeg`,
      `${Path.Src}**/*.png`,
      `${Path.Src}**/*.webp`
    ] )
    .pipe( minImage() )
    .pipe( dest( Path.Build ) );
};

const minifyVector = () => {
  return src( `${Path.Src}**/*.svg` )
    .pipe( minSVG() )
    .pipe( dest( Path.Build ) );
};

const createWebP = () => {
  return src( [
      `${Path.Src}**/*.jpg`,
      `${Path.Src}**/*.jpeg`,
      `${Path.Src}**/*.png`
    ] )
    .pipe( minImage( {
      webp: {}
    } ) )
    .pipe( dest( Path.Build ) );
};

const minifyImages = series(
  minifyRaster,
  minifyVector
);

const minifyProject = series(
  cleanBuildFolder,
  minifyHTML,
  minifyCSS,
  minifyJS,
  minifyImages
);

export default minifyProject;

export {
  cleanBuildFolder as clean,
  clearAll as clearall,
  minifyHTML as html,
  minifyCSS as css,
  minifyJS as js,
  minifyImages as image,
  createWebP as webp,
};
