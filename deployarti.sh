DIR=/home/travis/build/

cd $DIR
curl -fL https://getcli.jfrog.io | sh

zip -r build_$TRAVIS_BUILD_NUMBER.zip EnzDev/CIChat -x \
    \*node_modules/**\* \
    \*.git/**\* \
    \*.gitignore \
    \*.deployarti.sh

$DIR/jfrog rt config --interactive false --url https://epsi-artifactory.tatou.co/artifactory/
$DIR/jfrog rt u \
    --build-number $TRAVIS_BUILD_NUMBER \
    --build-name CIChat \
    --url https://epsi-artifactory.tatou.co/artifactory/ \
    build_$TRAVIS_BUILD_NUMBER.zip \
    generic-local/CIChat/