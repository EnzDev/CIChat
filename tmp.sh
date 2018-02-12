cd ..
curl -fL https://getcli.jfrog.io | sh

zip -r build_$TRAVIS_BUILD_NUMBER.zip CIChat -x \
    \*node_modules/**\* \
    \*.gitignore \
    \*.deployarti.sh

jfrog rt u \
    --build-number $TRAVIS_BUILD_NUMBER \
    --build-name CIChat \
    --url epsi-artifactory.tatou.co/artifactory/webapp \
    build_$TRAVIS_BUILD_NUMBER.zip \
    generic-local/CIChat/


