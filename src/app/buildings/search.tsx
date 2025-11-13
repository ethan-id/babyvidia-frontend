import {Input} from '@heroui/react';
import {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {LoaderCircle, Search as SearchIcon} from 'lucide-react';

interface SearchProps {
    onChange: Dispatch<SetStateAction<string>>;
}

export const Search: FC<SearchProps> = ({onChange}) => {
    const [searchValue, setSearchValue] = useState('');
    const [isDebouncing, setIsDebouncing] = useState(false);

    useEffect(() => {
        setIsDebouncing(true);
        const timeout = setTimeout(() => {
            onChange(searchValue);
            setIsDebouncing(false);
        }, 1000);
        return () => clearTimeout(timeout);
    }, [searchValue, onChange]);

    return (
        <Input 
            startContent={isDebouncing ? <LoaderCircle className={'animate-spin'}/> : <SearchIcon/>}
            placeholder='Search buildings' 
            onChange={(e) => setSearchValue(e.target.value)} 
            variant='bordered'
            color='primary'
            size='lg'
            className='max-w-md'
        />
    );
}