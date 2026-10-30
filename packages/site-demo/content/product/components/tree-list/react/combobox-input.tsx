import { useState } from 'react';
import { Combobox, TreeList } from '@lumx/react';

export default () => {
    const [text, setText] = useState('');
    const [value, setValue] = useState<string>();
    return (
        <div>
            <Combobox.Provider>
                <Combobox.Input value={text} onChange={setText} selectionMode="keep" placeholder="Filter foods…" />
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
                </TreeList>
                <Combobox.State emptyMessage="No food found" nbOptionMessage={(count) => `${count} result(s)`} />
            </Combobox.Provider>
        </div>
    );
};
