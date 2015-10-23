<?php
namespace AppBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Entity\Demo;

/**
 * Description of LoadDemoData
 *
 * @author seydu
 */
class LoadDemoData implements FixtureInterface
{
    /**
     * {@inheritDoc}
     */
    public function load(ObjectManager $manager)
    {
        foreach (array('Foo', 'Bar', 'Machin') as $name) {
            $entity = new Demo();
            $entity->setName($name);

            $manager->persist($entity);
        }
        $manager->flush();
    }
}
