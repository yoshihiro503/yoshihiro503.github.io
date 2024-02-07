set -eux
./configure.sh
make html
cp -r statics/. html/
cp html/home_en.html html/index.html
