/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

enum Categories {
    components = 'Components',
}
type Category = Categories;

interface IDemoObject {
    /**
     * The description of the demo.
     */
    description?: React.ReactNode;

    /**
     * A list of complementary files to load when displaying the source code.
     */
    files?: string[];

    /**
     * The title of the demo.
     */
    title?: string;
}
type DemoObject = IDemoObject;

/////////////////////////////

export { Categories, Category, DemoObject };
