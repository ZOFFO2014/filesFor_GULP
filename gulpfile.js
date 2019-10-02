'use strict';
//Подключаем модули галпа
const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
// const sourcemaps = require('gulp-sourcemaps');

//Таск на стили CSS
function styles() {
   //Шаблон для поиска файлов CSS
   //Всей файлы по шаблону './src/css/**/*.css'
   return gulp.src('src/**/*.css')
      //Объединение файлов в один
      .pipe(concat('style.css'))
      //Добавить префиксы
      .pipe(autoprefixer({
         overrideBrowserslist: ['last 2 versions'],
         cascade: false
      }))
      //Минификация CSS
      .pipe(cleanCSS({
         level: 2
      }))
      //Выходная папка для стилей
      .pipe(gulp.dest('./build/css'))
      .pipe(browserSync.stream());
}
//Таск на скрипты JS
function scripts() {
   //Шаблон для поиска файлов JS
   //Всей файлы по шаблону './src/js/**/*.js'
   return gulp.src('./src/js/*.js')
      //Объединение файлов в один
      .pipe(concat('script.js'))
      //Минификация JS
      //Выходная папка для скриптов
      .pipe(gulp.dest('./build/js'))
      .pipe(browserSync.stream());
}

// gulp.task('compress', compressJS);

// function compressJS() {
//    return (
//       gulp.src('./src/js/*.js')
//          .pipe(uglify())
//          .pipe(gulp.dest('./src/js/minify/'))
//    );
// }

//Удалить всё в указанной папке
function clean() {
   return del(['build/*', '!build/*.html'])

}
//Просматривать файлы
function watch() {
   browserSync.init({
      server: {
         baseDir: "./"
      }
   });
   //Следить за SCSS файлами
   gulp.watch('./src/scss/**/*.scss', cssPrepros)
   //Следить за CSS файлами
   gulp.watch('./src/css/**/*.css', styles)
   //Следить за JS файлами
   gulp.watch('./src/js/**/*.js', scripts)
   // следить за нужными файламив папке
   gulp.watch('./src/img/**/*.{png,jpg,svg}', copyFiles)
   //При изменении HTML запустить синхронизацию
   gulp.watch("./**/*.html").on('change', browserSync.reload);
}
//Компилируем sass
function cssPrepros() {
   return gulp.src('./src/scss/**/*.scss')
      // .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      // .pipe(sourcemaps.write('../css/'))
      .pipe(gulp.dest('./src/css'));
}
//Копирует необходимые файлы в нужную директорию ( при необходимости не забыть заменить в Watch)
function copyFiles() {
   del(['build/img/*'])
   return gulp.src(['./src/img/**/*.{png,jpg,svg}'], { base: './src/' })
      .pipe(gulp.dest('./build'))
}
//Таск вызывающий функцию cssPrepros
gulp.task('sass', cssPrepros);
//Таск вызывающий функцию styles
gulp.task('styles', styles);
//Таск вызывающий функцию scripts
gulp.task('scripts', scripts);
//Таск для очистки папки build
gulp.task('del', clean);
//Таск для копирования файлов
gulp.task('copy', copyFiles);
//Таск для слежения за файлами
gulp.task('watch', watch);
//Таск для удаления файлов в папке build и запуск styles и scripts
gulp.task('build', gulp.series(clean, gulp.parallel(cssPrepros, styles, scripts, copyFiles)));
//Таск запускает таск build и watch последовательно
gulp.task('dev', gulp.series('build', 'watch'));

