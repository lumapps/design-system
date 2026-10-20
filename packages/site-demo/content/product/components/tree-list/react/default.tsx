import { useState } from 'react';
import { TreeList } from '@lumx/react';

export default () => {
    const [value, setValue] = useState('lemon');
    return (
        <TreeList aria-label="Food" value={value} onChange={setValue}>
            <TreeList.Item label="Fruits" value="fruits">
                <TreeList.Item label="Citrus">
                    <TreeList.Item label="Lemon" value="lemon" />
                    <TreeList.Item label="Orange" value="orange" />
                </TreeList.Item>
                <TreeList.Item label="Apple" value="apple" description="Red or green" />
            </TreeList.Item>
            <TreeList.Item label="Vegetables" value="vegetables">
                <TreeList.Item label="Leek" value="leek" />
                <TreeList.Item label="Carrot" value="carrot" />
            </TreeList.Item>
            <TreeList.Item label="Drinks">
                <TreeList.Item label="Lemonade" value="lemonade" />
                <TreeList.Item label="Water" value="water" />
            </TreeList.Item>
        </TreeList>
    );
};
