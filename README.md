# HTML/CSS/JS front gulp project use SASS and Babel (ES6)
Basic Front End Project, includes Gulp to compile Sass into CSS, along with Autoprefixer, Babel into ES5 JS and Browser Sync.


# Icon
--
To add new icon :

Add flow class : .icon and .icon-[size] .icon-[name-of-icon]

Add size of icon : in the file _icon.scss /src/sass/import/utilities/_icon.scss update @include generate-icon mixin

Size step : 
```
    ($i * $CONST-BASE-UNIT) / 2
```

Name-of-icon : you need add icon name in styles.64.scss  
```
    $path-icon-[name]: "images/icon-[name].svg";
    &.icon-[name] {
        background-image: url($path-icon-[name]);
    }
```