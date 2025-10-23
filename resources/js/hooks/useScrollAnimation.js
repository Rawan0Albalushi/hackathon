import { useEffect, useRef, useState } from 'react';

export const useScrollAnimation = (options = {}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (options.once) {
                        observer.unobserve(entry.target);
                    }
                } else if (!options.once) {
                    setIsVisible(false);
                }
            },
            {
                threshold: options.threshold || 0.1,
                rootMargin: options.rootMargin || '0px 0px -50px 0px'
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [options.threshold, options.rootMargin, options.once]);

    return [ref, isVisible];
};

export const useStaggeredAnimation = (items, delay = 100) => {
    const [visibleItems, setVisibleItems] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisibleItems(items);
        }, delay);

        return () => clearTimeout(timer);
    }, [items, delay]);

    return visibleItems;
};

export const useParallax = (speed = 0.5) => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setOffset(window.pageYOffset * speed);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [speed]);

    return offset;
};
