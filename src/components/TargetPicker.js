import { getTrackBackground, Range } from 'react-range';

function TargetPicker(props) {
    const { range, setRange } = props; 

    const trackColors = {
        min: 0,
        max: 100,
        values: range,
        colors: ['#ccc', '#8a5858', '#ccc'],
    }

    return (
        <div style={{flex: 0.8}}>
            <Range
            step={1}
            min={0}
            max={100}
            values={range}
            onChange={arr => setRange(arr)}
            draggableTrack={true}
            renderTrack={({ props, children }) => (
            <div
                {...props}
                style={{
                ...props.style,
                height: '6px',
                width: '100%',
                background: getTrackBackground(trackColors)
                }}
            >
                {children}
            </div>
            )}
            renderThumb={({ props, index }) => (
            <div
                {...props}
                style={{
                ...props.style,
                height: '20px',
                width: '20px',
                backgroundColor: 'whitesmoke',
                borderRadius: '10px',
                border: '1px solid #ccc',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: '28px',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        fontFamily: 'Arial,Helvetica Neue,Helvetica,sans-serif',
                        padding: '4px',
                        borderRadius: '4px',
                        backgroundColor: 'gray'
                    }}
                >
              {`${range[index].toFixed(0)}%`}
            </div>
            </div>
            )}
        />
      </div>
    );
}

export default TargetPicker; 