for dir in ./src/components/*/
do
    dir=${dir%*/}
    echo ${dir##*/}
    mkdir -p ./packages/lumx-react/components/${dir##*/}
    cp -r ./src/components/${dir##*/}/react/* ./packages/lumx-react/components/${dir##*/}/
    mkdir -p ./packages/lumx-angularjs/components/${dir##*/}
    cp -r ./src/components/${dir##*/}/angularjs/* ./packages/lumx-angularjs/components/${dir##*/}/
    mkdir -p ./packages/lumx-core/components/${dir##*/}
    cp -r ./src/components/${dir##*/}/style/* ./packages/lumx-core/components/${dir##*/}
done

cp -r ./src/core/react/* ./packages/lumx-react/
cp -r ./src/core/angularjs/* ./packages/lumx-angularjs/
cp -r ./src/core/style ./packages/lumx-core/
