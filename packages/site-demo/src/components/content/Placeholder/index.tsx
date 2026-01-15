type Props = React.FC<{
    name: string;
    height?: React.CSSProperties['height'];
    width?: React.CSSProperties['width'];
    textAlign?: 'center' | 'right' | 'left';
}>;
export const Placeholder: Props = ({ name, height = 36, width = 36, textAlign = 'center' }) => (
    <div
        style={{
            height,
            width,
            background: '#FFCFF5',
            color: '#FF00C7',
            textAlign,
            lineHeight: `${height}px`,
            borderRadius: 2,
            fontSize: 12,
            fontWeight: 500,
            paddingLeft: 14,
            paddingRight: 14,
        }}
    >
        {name}
    </div>
);
