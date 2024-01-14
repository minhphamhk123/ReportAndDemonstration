import { useEffect } from 'react';
import Logo from '../components/Logo';
import Loading from '../components/Loading';
import DocCard from '../components/DocCard';
import styles from '../styles/Home.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { getAllPublicDocsAction } from '../redux/documents/docs.actions';

function Home() {

     const dispatch = useDispatch();
     const { loading, error, publicDocs } = useSelector((state) => state.docs);

     useEffect(() => {
          dispatch(getAllPublicDocsAction())
     }, [])

     return (
          <div className={styles.container}>
               <div className={styles.banner}>
                    <div>
                         <Logo />
                         <h1>
                              Topic 20: Building a website to manage report writing and demonstration in quality inspection
                         </h1>
                    </div>
                    <div>
                         <img src="/nha_a.jpg" alt="banner-image" />
                    </div>
               </div>
               <h1 className={styles['articles-heading']}>Public <span>Documents</span></h1>
               <div className={styles['articles-container']}>
                    {
                         loading ? <Loading /> :
                              error ? <h1>Error...</h1> :
                                   <div className={styles.articles}>
                                        {
                                             publicDocs.map(el => <DocCard key={el._id} data={el} />)
                                        }
                                   </div>
                    }
               </div>
          </div>
     )
}

export default Home