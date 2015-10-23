<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        // replace this example code with whatever you need
        return $this->render('AppBundle:Default:index.html.twig', array(
            'base_dir' => realpath($this->container->getParameter('kernel.root_dir').'/..'),
        ));
    }
    
    /**
     * 
     * @return \Doctrine\ORM\Repository
     */
    private function getDemoRepo()
    {
        return $this->getDoctrine()->getRepository('AppBundle:Demo');
    }

    /**
     * @Route("/list", name="demo_list")
     */
    public function listAction(Request $request)
    {
        if($request->isXmlHttpRequest()) {
            $items = [];
            foreach ($this->getDemoRepo()->findAll() as $entity)
            {
                $items[] = [
                    'id' => $entity->getId(),
                    'name' => $entity->getName()
                ];                    
            }
            return new JsonResponse($items);
        }
        return $this->indexAction($request);
    }

    /**
     * @Route("/edit/{id}", name="demo_edit")
     */
    public function editAction(Request $request)
    {
        $id = $request->get('id');
        $entity = $this->getDemoRepo()->find($id);
        if(!$entity) {
            $message = 'No item found with id='.$id;
            if($request->isXmlHttpRequest()) {
                $data = [
                    'message' => $message
                ];
                return new JsonResponse($data);
            } else {
                throw new NotFoundHttpException($message);
            }
        }
        if($request->isXmlHttpRequest()) {
            $data = [
                'id' => $entity->getId(),
                'name' => $entity->getName()
            ];   
            return new JsonResponse($data);
        }  else {
            $data = $request->get('demo_edit');
            if($data['name']) {
                $entity->setName($data['name']);
            }
            $this->getDoctrine()->getManager()->persist($entity);
            $this->getDoctrine()->getManager()->flush();
            return $this->redirectToRoute('demo_list');
        }
    }
    
    

    /**
     * @Route("/delete/{id}", name="demo_delete")
     */
    public function deleteAction(Request $request)
    {
        $id = $request->get('id');
        $entity = $this->getDemoRepo()->find($id);
        if(!$entity) {
            $message = 'No item found with id='.$id;
            if($request->isXmlHttpRequest()) {
                $data = [
                    'message' => $message
                ];
                return new JsonResponse($data);
            } else {
                throw new NotFoundHttpException($message);
            }
        }
        $this->getDoctrine()->getManager()->remove($entity);
        $this->getDoctrine()->getManager()->flush();
        if($request->isXmlHttpRequest()) {
            $data = [
                'id' => $entity->getId(),
                'name' => $entity->getName(),
                'redirect' => $this->generateUrl('demo_list')
            ];   
            return new JsonResponse($data);
        }  else {
            return $this->redirectToRoute('demo_list');
        }
    }
}
